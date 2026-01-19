import mongoose from 'mongoose'
import Guest from '../lib/models/Guest'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
dotenv.config()

async function exportGuests() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not defined')
    process.exit(1)
  }

  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get all guests
    const guests = await Guest.find({}, { name: 1, code: 1 }).sort({ name: 1 })

    if (guests.length === 0) {
      console.log('⚠️  No guests found in database')
      return
    }

    console.log(`📋 Found ${guests.length} guests in database\n`)

    // Generate CSV content
    const csvHeader = 'Name,Code\n'
    const csvRows = guests.map((guest) => `"${guest.name}","${guest.code}"`).join('\n')
    const csvContent = csvHeader + csvRows

    // Generate formatted text content
    const textContent = guests
      .map((guest) => `${guest.name.padEnd(40)}${guest.code}`)
      .join('\n')

    // Generate JSON content
    const jsonContent = JSON.stringify(
      guests.map((guest) => ({
        name: guest.name,
        code: guest.code,
      })),
      null,
      2
    )

    // Write files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const csvPath = path.join(process.cwd(), `guests-export-${timestamp}.csv`)
    const txtPath = path.join(process.cwd(), `guests-export-${timestamp}.txt`)
    const jsonPath = path.join(process.cwd(), `guests-export-${timestamp}.json`)

    fs.writeFileSync(csvPath, csvContent, 'utf-8')
    fs.writeFileSync(txtPath, textContent, 'utf-8')
    fs.writeFileSync(jsonPath, jsonContent, 'utf-8')

    console.log('✅ Successfully exported guests:\n')
    console.log('─'.repeat(60))
    console.log('NAME'.padEnd(40) + 'CODE')
    console.log('─'.repeat(60))

    for (const guest of guests) {
      console.log(`${guest.name.padEnd(40)}${guest.code}`)
    }

    console.log('─'.repeat(60))
    console.log(`\n📁 Files created:`)
    console.log(`   CSV:  ${path.basename(csvPath)}`)
    console.log(`   TXT:  ${path.basename(txtPath)}`)
    console.log(`   JSON: ${path.basename(jsonPath)}`)
    console.log(`\n✅ Total: ${guests.length} guests exported`)
  } catch (error) {
    console.error('❌ Error exporting guests:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

exportGuests()
