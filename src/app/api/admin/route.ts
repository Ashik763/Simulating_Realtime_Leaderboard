// import { prisma } from '@/db/prisma'
import {  NextResponse } from 'next/server'


export async function GET() {
//   const { searchParams } = new URL(request.url)
//   const id = searchParams.get('id')

  try {
    
      // Get a specific user by ID
      const user = {name:"BOss is here"}

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json(user)

  } catch (error) {
    console.error('Error fetching user(s):', error)
    return NextResponse.json({ error: 'Error fetching user(s)' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // const { name, email } = await request.json()
    // const user = await prisma.user.create({
    //   data: { name, email },
    // })
    return NextResponse.json({success:true}, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}

