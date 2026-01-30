import mongoose from 'mongoose'
import Guest from '../lib/models/Guest'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Guest names from jofer_guest.csv and hope_guests.csv
const guestNames = [
  // From jofer_guest.csv
  // 'Jofer Usa',
  // 'Anjelo Usa',
  // 'John Reyster Usa',
  // 'Ester Usa',
  // 'Renante Usa',
  // 'Marjerrie Fabon',
  // 'Sherlyne Fabon',
  // 'Gabriel Fabon',
  // 'Mardie Fabon',
  // 'Jerry Fabon',
  // 'Rachel Del Rosario',
  // 'Daniel Del Rosario',
  // 'Celestino Usa',
  // 'Wineline Usa',
  // 'John David Ramos',
  // 'Cielamae Ramos',
  // 'Glenn Beleber',
  // 'Florence Beleber',
  // 'Gerence Trinidad',
  // 'Vergel Salonga',
  // 'Bryann Salonga',
  // 'Miriam Salonga',
  // 'Marc Sibulangcao',
  // 'Rhea Sibulangcao',
  // 'Marianne Sibulangcao',
  // 'Mishael Trinidad',
  // 'Samuel Trinidad',
  // 'Karlene Trinidad',
  // 'Rhodora Trinidad',
  // 'Rosie Reduta',
  // 'Alex Reduta',
  // 'Bench Manalastas',
  // 'Kristine Manalastas',
  // 'Cipryan Cabal',
  // 'Kia Cabal',
  // 'Nelly Berania',
  // 'Ernie Chan',
  // 'Riza Chan',
  // 'Cipriano Cabal',
  // 'Amelia Cabal',
  // 'Pricilla Hermosura',
  // 'Rolando Gonzales',
  // 'Teodora Gonzales',
  // 'Richard De Castro',
  // 'Jhey Ann De Castro',
  // 'Jazz De Castro',
  // 'Jericho Revilla',
  // 'Allen Samillano',
  // 'Jorenda Samillano',
  // 'Caesar Garcia',
  // 'Cora Garcia',
  // 'Glenise Chan',
  // 'Daniel Chan',
  // 'Luisito Barraquio',
  // 'Jennifer Barraquio',
  // // From hope_guests.csv
  // 'Christine Hope Medalla',
  // 'Apple De Mesa',
  // 'Miko De Mesa',
  // 'Daphne De Mesa',
  // 'Nemie De Mesa',
  // 'Eddie De Mesa',
  // 'Vicky Palma',
  // 'Nomer Palma',
  // 'Nikki James Palma',
  // 'Adrielle Palma',
  // 'Kyn Barlaan',
  // 'Simon Barlaan',
  // 'Rizia Marfil',
  // 'Francis Marfil',
  // 'Leany Marfil',
  // 'Sydney Anisor',
  // 'Lorraine Feniza',
  // 'Lorelie Feniza',
  // 'Marjaneh Insorio',
  // 'Baby Insorio',
  // 'Olan Insorio',
  // 'Jhazley Insorio',
  // 'Joshbelle Ramirez',
  // 'Vicky Ramirez',
  // 'Ghezelle Bangate',
  // 'Candice Verder',
  // 'CK Verder',
  // 'Red Carola',
  // 'Rolly Pabalan',
  // 'Randy Alcantara',
  // 'Maricel Alcantara',
  // 'Lotis De Torres',
  // 'Fernando De Torres',
  // 'Laila Angeles',
  // 'Vivian Mendoza',
  // 'Allan Mendoza',
  // 'Cynthia Pacete',
  // 'Jernald Pacete',
  // 'Giddy Casupang',
  // 'Janice Disonglo',
  // 'Miriam Anido',
  // 'Felimon Anido',
  // 'Claire Ramos',
  // 'Stanley Ramos',
  // 'John Paul Astejada',
  // 'Irene Catibayan',
  "Adelfa Sieteriales",
  "Niel Patrick Berania",
  "Marinette Berania"
]

// Characters for generating codes (uppercase alphanumeric only)
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateCode(length: number = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return code
}

async function generateUniqueCode(existingCodes: Set<string>): Promise<string> {
  let code: string
  let attempts = 0
  const maxAttempts = 100

  do {
    code = generateCode()
    attempts++
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate unique code after maximum attempts')
    }
  } while (existingCodes.has(code))

  existingCodes.add(code)
  return code
}

async function seedGuests() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not defined')
    process.exit(1)
  }

  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get existing guests to avoid duplicates (by code and name)
    const existingGuests = await Guest.find({}, { code: 1, name: 1 })
    const existingCodes = new Set(existingGuests.map((g) => g.code))
    const existingNames = new Set(existingGuests.map((g) => g.name.toLowerCase()))

    console.log(`📋 Found ${existingGuests.length} existing guests in database`)

    // Filter out guests that already exist by name
    const newGuestNames = guestNames.filter(
      (name) => !existingNames.has(name.toLowerCase())
    )
    const skippedCount = guestNames.length - newGuestNames.length

    if (skippedCount > 0) {
      console.log(`⏭️  Skipping ${skippedCount} guests (already exist by name)`)
    }

    if (newGuestNames.length === 0) {
      console.log('\n✅ No new guests to add. All guests already exist.')
      return
    }

    console.log(`📝 Preparing to add ${newGuestNames.length} new guests...\n`)

    const guestsToCreate = []
    const generatedCodes = new Set(existingCodes)

    for (const name of newGuestNames) {
      const code = await generateUniqueCode(generatedCodes)
      guestsToCreate.push({
        name,
        code,
        status: null,
        rsvpConfirmed: false,
      })
    }

    // Insert all guests
    const result = await Guest.insertMany(guestsToCreate)

    console.log('✅ Successfully created guests:\n')
    console.log('─'.repeat(50))
    console.log('NAME'.padEnd(30) + 'CODE')
    console.log('─'.repeat(50))

    for (const guest of result) {
      console.log(`${guest.name.padEnd(30)}${guest.code}`)
    }

    console.log('─'.repeat(50))
    console.log(`\n✅ Total: ${result.length} guests added`)
  } catch (error) {
    console.error('❌ Error seeding guests:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

seedGuests()
