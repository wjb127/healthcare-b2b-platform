import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export const emailTemplates = {
  newProject: (projectTitle: string, projectUrl: string) => ({
    subject: `새로운 프로젝트: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0875FF;">새로운 프로젝트가 등록되었습니다</h2>
        <p>프로젝트명: <strong>${projectTitle}</strong></p>
        <p>지금 바로 확인하고 응찰에 참여해보세요!</p>
        <a href="${projectUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0875FF; color: white; text-decoration: none; border-radius: 5px;">프로젝트 보기</a>
      </div>
    `,
  }),

  newBid: (projectTitle: string, bidderCompany: string, projectUrl: string) => ({
    subject: `새로운 응찰: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0875FF;">새로운 응찰이 접수되었습니다</h2>
        <p>프로젝트: <strong>${projectTitle}</strong></p>
        <p>응찰자: <strong>${bidderCompany}</strong></p>
        <p>응찰 내역을 확인하고 비교해보세요.</p>
        <a href="${projectUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0875FF; color: white; text-decoration: none; border-radius: 5px;">응찰 확인하기</a>
      </div>
    `,
  }),

  bidAccepted: (projectTitle: string, projectUrl: string) => ({
    subject: `낙찰 성공: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #48BB78;">축하합니다! 낙찰되었습니다</h2>
        <p>프로젝트: <strong>${projectTitle}</strong></p>
        <p>귀사의 응찰이 선정되었습니다. 프로젝트 진행을 위해 구매자와 연락해주세요.</p>
        <a href="${projectUrl}" style="display: inline-block; padding: 10px 20px; background-color: #48BB78; color: white; text-decoration: none; border-radius: 5px;">프로젝트 확인</a>
      </div>
    `,
  }),

  bidRejected: (projectTitle: string) => ({
    subject: `응찰 결과: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E53E3E;">응찰 결과 안내</h2>
        <p>프로젝트: <strong>${projectTitle}</strong></p>
        <p>안타깝게도 이번 프로젝트에서는 선정되지 않았습니다.</p>
        <p>다음 기회에 더 좋은 결과가 있기를 바랍니다.</p>
      </div>
    `,
  }),
}