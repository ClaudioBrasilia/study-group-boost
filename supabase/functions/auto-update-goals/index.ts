import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting automatic goal updates...')

    // Get all completed study sessions from the last 24 hours that haven't been processed
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: sessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select(`
        id,
        user_id,
        subject_id,
        duration_minutes,
        completed_at
      `)
      .not('completed_at', 'is', null)
      .gte('completed_at', oneDayAgo)

    if (sessionsError) {
      console.error('Error fetching study sessions:', sessionsError)
      throw sessionsError
    }

    console.log(`Found ${sessions?.length || 0} study sessions to process`)

    if (!sessions || sessions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No sessions to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Group sessions by user and get their groups
    const userSessions = new Map<string, any[]>()
    sessions.forEach(session => {
      const userId = session.user_id
      if (!userSessions.has(userId)) {
        userSessions.set(userId, [])
      }
      userSessions.get(userId)!.push(session)
    })

    let goalsUpdated = 0
    let pointsAwarded = 0

    // Process each user's sessions
    for (const [userId, userSessionList] of userSessions) {
      // Get user's groups
      const { data: userGroups, error: groupsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId)

      if (groupsError) {
        console.error('Error fetching user groups:', groupsError)
        continue
      }

      if (!userGroups || userGroups.length === 0) continue

      const groupIds = userGroups.map(g => g.group_id)

      // Get goals for user's groups
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .in('group_id', groupIds)

      if (goalsError) {
        console.error('Error fetching goals:', goalsError)
        continue
      }

      if (!goals || goals.length === 0) continue

      // Filter to only incomplete goals
      const incompleteGoals = goals.filter(goal => goal.current < goal.target)

      // Process sessions and update matching goals
      for (const session of userSessionList) {
        const sessionDuration = session.duration_minutes

        for (const goal of incompleteGoals) {
          let shouldUpdate = false
          let progressToAdd = 0

          // Check if goal matches session
          if (goal.type === 'time' && 
              (!goal.subject_id || goal.subject_id === session.subject_id)) {
            shouldUpdate = true
            progressToAdd = sessionDuration
          }

          if (shouldUpdate && progressToAdd > 0) {
            const newCurrent = Math.min(goal.current + progressToAdd, goal.target)
            const actualProgress = newCurrent - goal.current

            // Update goal progress
            const { error: updateError } = await supabase
              .from('goals')
              .update({ 
                current: newCurrent,
                updated_at: new Date().toISOString()
              })
              .eq('id', goal.id)

            if (updateError) {
              console.error('Error updating goal:', updateError)
              continue
            }

            // Calculate points (1 point per minute for time goals)
            const points = actualProgress * 1

            // Update user points
            const { error: pointsError } = await supabase
              .from('user_points')
              .upsert({
                user_id: userId,
                group_id: goal.group_id,
                points: points,
                updated_at: new Date().toISOString()
              })

            if (pointsError) {
              console.error('Error updating points:', pointsError)
            } else {
              pointsAwarded += points
            }

            goalsUpdated++

            console.log(`Updated goal ${goal.id} for user ${userId}: +${actualProgress} progress, +${points} points`)
          }
        }
      }
    }

    const result = {
      message: 'Goals updated successfully',
      sessionsProcessed: sessions.length,
      goalsUpdated,
      pointsAwarded
    }

    console.log('Completed goal updates:', result)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in auto-update-goals:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})