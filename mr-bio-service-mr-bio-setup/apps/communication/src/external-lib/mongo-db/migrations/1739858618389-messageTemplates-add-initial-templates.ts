import { randomUUID } from 'crypto';
import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';

class Migration implements IMigration {
  collectionName = dbCollections.MESSAGE_TEMPLATE;
  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const assigner = {
      by: 'System',
      at: new Date(),
    };

    const data = [
      {
        type: 'system',
        name: 'Login OTP',
        code: 'login_otp',
        created: assigner,
        updated: assigner,
        messageTemplateId: randomUUID(),
        variables: ['firstName', 'otp'],
        triggerPoints: ['login_otp_generated'],
        description: 'This is a template for Login OTP',
        messages: [
          {
            attachments: [],
            method: 'email',
            subject: 'Security Code - OTP',
            body: "<p>Hi {{firstName}},</p>\n              <p>Please use the verification code below to complete your login process.</p>\n              <h3 style='text-align: center'>{{otp}}</h3>\n              <p style='text-align: center'><small>This code will expire in 5 minutes.</small></p>",
          },
        ],
      },
      {
        type: 'system',
        created: assigner,
        updated: assigner,
        name: 'Reset Password',
        code: 'reset_password',
        messageTemplateId: randomUUID(),
        triggerPoints: ['reset_password'],
        variables: ['firstName', 'resetPasswordLink'],
        description: 'This is reset password template',
        messages: [
          {
            attachments: [],
            method: 'email',
            subject: 'Reset Your Password',
            body: '<p>Hi {{firstName}},</p>\n              <h3>Reset Your Password</h3>\n              <p>Follow the link below to reset your Mr Bio password: </p>\n              <p style="text-align: center; margin:40px auto 40px"><a href="{{resetPasswordLink}}" class="btn">Reset my Password</a></p>\n              <p><small> This link is valid for 1 hour. Please do not hesitate to contact us if you have any difficulties in resetting your password. </small></p>\n              <p><small> If you didn’t request this, please ignore this email. Your password won’t change until you access the link above and create a new one. </small></p>\n              <p>Thanks,</p>\n              <p>Mr Bio Team</p>',
          },
        ],
      },
      {
        type: 'system',
        created: assigner,
        updated: assigner,
        name: 'Account Activation',
        code: 'account_activation',
        messageTemplateId: randomUUID(),
        triggerPoints: ['account_activation'],
        description: 'This is an account activation template',
        variables: ['firstName', 'email', 'verificationLink'],
        messages: [
          {
            attachments: [],
            method: 'email',
            subject: 'Invitation to the Mr BioPortal',
            body: '<p>Hi {{firstName}},</p>\n              <h3>Verify your email address</h3>\n              <p> Welcome to Mr Bio. Please complete your registration process by clicking on the link below. </p>\n              <p style="text-align: center; margin:40px auto 40px"><a href="{{verificationLink}}" class="btn">Complete Registration</a></p>\n              <p><small> This link is valid for 24 hours. Please do not hesitate to contact us if you have any difficulties in registration. </small></p>\n              <p><small> If you didn\'t request this email, you can safely ignore it. </small></p>',
          },
        ],
      },
    ];
    await db.insertMany(this.collectionName, data as any);
  }

  /**
   * Reverse the migrations.
   */
  async down(db: DB) {
    await db.deleteMany(this.collectionName, {
      code: {
        $in: ['login_otp', 'reset_password', 'account_activation'],
      },
    } as any);
  }
}

export default Migration;
