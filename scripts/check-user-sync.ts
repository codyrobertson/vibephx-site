import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserSync() {
  // Get attendance user IDs
  const attendance = await prisma.workshopAttendance.findMany({
    select: { userId: true },
    distinct: ['userId']
  })
  
  console.log('Unique user IDs in WorkshopAttendance:', attendance.length)
  console.log(attendance.map(a => a.userId))
  
  // Check if these users exist
  for (const att of attendance) {
    const user = await prisma.user.findUnique({ where: { id: att.userId } })
    console.log(`\nUser ${att.userId}:`, user ? `${user.email} (exists)` : 'NOT FOUND IN USERS TABLE')
  }
  
  // Show all users
  const allUsers = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log('\n\nAll users in database:', allUsers.length)
  allUsers.forEach(u => console.log(`- ${u.id}: ${u.email}`))
  
  await prisma.$disconnect()
}

checkUserSync().catch(console.error)
