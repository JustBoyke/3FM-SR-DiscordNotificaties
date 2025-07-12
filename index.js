const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const URL = process.env.URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const HISTORY_FILE = './donations.json';

let lastDonations = [];

// 🧾 Laad de geschiedenis uit JSON-bestand
function loadHistory() {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
    lastDonations = JSON.parse(raw);
    console.log(`📚 Gegevens geladen uit ${HISTORY_FILE}`);
  } catch {
    console.log(`📁 Geen bestaande ${HISTORY_FILE} gevonden, begin opnieuw.`);
    lastDonations = [];
  }
}

// 💾 Schrijf nieuwe geschiedenis weg
function saveHistory() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(lastDonations, null, 2), 'utf8');
}

async function getDonations() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });

  const donations = await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('.sc-f5bc1800-1'));
    return blocks.map(block => {
      const nameEl = block.querySelector('.sc-f5bc1800-2 p');
      const amountEl = block.querySelectorAll('.sc-f5bc1800-2 p')[1];
      const messageEl = block.querySelector('.sc-f5bc1800-4, .sc-2dc521d6-0');

      return {
        name: nameEl?.innerText?.trim() || 'Anoniem',
        amount: amountEl?.innerText?.trim() || '€ ?',
        message: messageEl?.innerText?.trim() || ''
      };
    });
  });

  await browser.close();
  return donations;
}

async function sendDiscordNotification(donation) {
  const message = `💚 **${donation.name}** doneerde **${donation.amount}**\n💬 ${donation.message || '_Geen bericht_'}`;

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message
    });
  } catch (err) {
    console.error("❌ Fout bij versturen naar Discord:", err.message);
  }
}

async function checkNewDonations() {
  try {
    const current = await getDonations();
    const newOnes = current.filter(d =>
      !lastDonations.some(ld => ld.name === d.name && ld.amount === d.amount && ld.message === d.message)
    );

    if (newOnes.length > 0) {
      console.log(`🎉 ${newOnes.length} nieuwe donatie(s):`);
      for (const d of newOnes) {
        console.log(`💚 ${d.name} doneerde ${d.amount} — "${d.message}"`);
        await sendDiscordNotification(d);
      }

      // Voeg toe aan lokale geschiedenis en sla op
      lastDonations = [...newOnes, ...lastDonations].slice(0, 50); // bewaar max 50 entries
      saveHistory();
    } else {
      console.log("⏳ Geen nieuwe donaties.");
    }
  } catch (e) {
    console.error("❌ Fout bij ophalen:", e.message);
  }
}

// Start het script
loadHistory();
checkNewDonations();
setInterval(checkNewDonations, 60 * 1000);
