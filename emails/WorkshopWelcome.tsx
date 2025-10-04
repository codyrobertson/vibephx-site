import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
  Img,
  Heading
} from '@react-email/components'

interface WorkshopWelcomeEmailProps {
  attendeeName: string
  workshopTitle: string
  workshopDate: string
  workshopLocation: string | null
  creditsAwarded: number
  hasAccount: boolean
}

export const WorkshopWelcomeEmail = ({
  attendeeName,
  workshopTitle,
  workshopDate,
  workshopLocation,
  creditsAwarded,
  hasAccount
}: WorkshopWelcomeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Tailwind>
      <Head />
      <Body className="bg-black font-sans py-[40px]">
        <Container className="bg-[#1a1a1a] max-w-[600px] mx-auto rounded-[12px] overflow-hidden border-2 border-gray-700">
          {/* Header */}
          <Section className="bg-gradient-to-r from-orange-500 to-red-600 px-[32px] py-[28px]">
            <Img
              src="https://www.vibecodephx.com/logo.png"
              alt="VibeCode PHX"
              width="160"
              height="30"
              className="mb-[12px]"
            />
            <Heading className="text-white text-[24px] font-bold m-0">
              You're in! ${creditsAwarded.toFixed(2)} in credits awaits.
            </Heading>
          </Section>

          {/* Main Content */}
          <Section className="px-[32px] py-[32px]">
            <Text className="text-white text-[16px] mb-[24px] m-0">
              Hey {attendeeName},
            </Text>

            <Text className="text-gray-300 text-[16px] leading-[24px] mb-[32px] m-0">
              You're registered for <strong className="text-white">{workshopTitle}</strong>. We've added <strong className="text-orange-400">${creditsAwarded.toFixed(2)} in AI credits</strong> to your account to help you build your first app.
            </Text>

            {/* Workshop Details Card */}
            <Section className="bg-[#242424] border border-gray-600 rounded-[8px] p-[24px] mb-[32px]">
              <Heading className="text-white text-[20px] font-bold mb-[16px] m-0">
                Workshop Details
              </Heading>

              <Section className="mb-[12px]">
                <Text className="text-gray-400 text-[14px] m-0 mb-[4px]">Event:</Text>
                <Text className="text-white text-[16px] font-semibold m-0">{workshopTitle}</Text>
              </Section>

              <Section className="mb-[12px]">
                <Text className="text-gray-400 text-[14px] m-0 mb-[4px]">Date:</Text>
                <Text className="text-white text-[16px] font-semibold m-0">
                  {new Date(workshopDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>
              </Section>

              {workshopLocation && (
                <Section className="mb-[12px]">
                  <Text className="text-gray-400 text-[14px] m-0 mb-[4px]">Location:</Text>
                  <Text className="text-white text-[16px] font-semibold m-0">{workshopLocation}</Text>
                </Section>
              )}

              <Section>
                <Text className="text-gray-400 text-[14px] m-0 mb-[4px]">Credits:</Text>
                <Text className="text-orange-400 text-[16px] font-bold m-0">${creditsAwarded.toFixed(2)}</Text>
              </Section>
            </Section>

            {/* What you'll build */}
            <Section className="mb-[32px]">
              <Heading className="text-white text-[20px] font-bold mb-[16px] m-0">
                What you'll build
              </Heading>
              <Text className="text-gray-300 text-[16px] leading-[24px] mb-[20px] m-0">
                Use the PRD Builder to turn your idea into a complete product specification with AI assistance. Define features, choose your tech stack, and get ready to ship.
              </Text>

              <Button
                href={hasAccount ? 'https://www.vibecodephx.com/workshop/welcome' : 'https://www.vibecodephx.com/auth/signup'}
                className="bg-orange-500 hover:bg-orange-600 text-white px-[32px] py-[14px] rounded-[8px] text-[16px] font-bold no-underline inline-block"
              >
                {hasAccount ? 'View Your Workshop Details' : 'Create Account & Get Started'}
              </Button>
            </Section>

            <Hr className="border-gray-600 my-[24px]" />

            <Text className="text-gray-400 text-[14px] leading-[20px] m-0">
              Questions? Reply to this email or visit <span className="text-white underline">vibecodephx.com</span>
            </Text>
          </Section>

          {/* Footer */}
          <Section className="bg-[#0f0f0f] px-[32px] py-[24px] border-t border-gray-700">
            <Text className="text-gray-500 text-[12px] text-center m-0 mb-[8px]">
              VibeCode PHX{workshopLocation && ` • ${workshopLocation}`}
            </Text>
            <Text className="text-gray-500 text-[12px] text-center m-0">
              © 2025 VibeCode PHX. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default WorkshopWelcomeEmail
