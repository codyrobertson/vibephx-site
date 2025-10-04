import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testWorkshops() {
  // First, get a user to test with
  const sampleUser = await prisma.user.findFirst()
  if (!sampleUser) {
    console.log('No users found in database')
    return
  }

  console.log('Testing workshops for user:', sampleUser.email, '(', sampleUser.id, ')')

  const workshops = await prisma.workshop.findMany({
    where: {
      attendees: {
        some: {
          userId: sampleUser.id
        }
      }
    },
    include: {
      attendees: {
        where: {
          userId: sampleUser.id
        },
        select: {
          id: true,
          creditsAwarded: true,
          creditsApplied: true
        }
      }
    },
    orderBy: { date: 'desc' }
  })

  console.log('\nWorkshops found for this user:', workshops.length)
  if (workshops.length > 0) {
    console.log('Workshops:', JSON.stringify(workshops, null, 2))
  }

  // Check all workshops
  const allWorkshops = await prisma.workshop.findMany({
    include: {
      attendees: {
        select: {
          userId: true,
          creditsAwarded: true
        }
      }
    }
  })
  console.log('\nTotal workshops in DB:', allWorkshops.length)
  if (allWorkshops.length > 0) {
    console.log('All workshops:', JSON.stringify(allWorkshops, null, 2))
  }

  // Check attendance for this user
  const attendance = await prisma.workshopAttendance.findMany({
    where: { userId: sampleUser.id },
    include: {
      workshop: {
        select: {
          title: true,
          date: true
        }
      }
    }
  })
  console.log('\nAttendance records for user:', attendance.length)
  if (attendance.length > 0) {
    console.log('Attendance:', JSON.stringify(attendance, null, 2))
  }

  await prisma.$disconnect()
}

testWorkshops().catch(console.error)
