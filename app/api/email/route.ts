import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email/resend'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    const supabase = await createClient()

    switch (type) {
      case 'new_project': {
        // Send email to all B users about new project
        const { data: suppliers } = await supabase
          .from('profiles')
          .select('email')
          .eq('user_type', 'B')

        if (suppliers) {
          const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/supplier/projects/${data.projectId}`
          const template = emailTemplates.newProject(data.projectTitle, projectUrl)

          for (const supplier of suppliers) {
            await sendEmail({
              to: supplier.email,
              ...template,
            })
          }
        }
        break
      }

      case 'new_bid': {
        // Send email to project owner about new bid
        const { data: project } = await supabase
          .from('projects')
          .select('title, profiles!projects_user_id_fkey(email)')
          .eq('id', data.projectId)
          .single()

        if (project && project.profiles) {
          const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/buyer/projects/${data.projectId}`
          const template = emailTemplates.newBid(
            project.title,
            data.bidderCompany,
            projectUrl
          )

          await sendEmail({
            to: project.profiles.email,
            ...template,
          })
        }
        break
      }

      case 'bid_accepted': {
        // Send email to accepted bidder
        const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/supplier/projects/${data.projectId}`
        const template = emailTemplates.bidAccepted(data.projectTitle, projectUrl)

        await sendEmail({
          to: data.bidderEmail,
          ...template,
        })
        break
      }

      case 'bid_rejected': {
        // Send email to rejected bidders
        const template = emailTemplates.bidRejected(data.projectTitle)

        for (const email of data.rejectedEmails) {
          await sendEmail({
            to: email,
            ...template,
          })
        }
        break
      }

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in email API:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}