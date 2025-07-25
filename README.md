# 3FM Serious Request – Discord Donation Notifications

This script monitors the latest donations on the [3FM Serious Request](https://www.npo3fm.nl/) website and sends real-time updates to a specified Discord channel via a webhook.

It uses a lightweight web crawler that runs every minute, carefully designed to avoid overloading the 3FM servers.

## Features

- 🕒 Checks for new donations every 60 seconds  
- 📢 Sends updates directly to a Discord channel using a webhook  
- ✅ Designed with minimal server impact  

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/3FM-SR-DiscordNotificaties.git
   cd 3FM-SR-DiscordNotificaties
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following configuration:

   ```env
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   URL=https://www.npo3fm.nl/seriousrequest/donaties
   ```

4. Run the script:
   ```bash
   node index.js
   ```

## Disclaimer

This project is intended for educational and personal use only.  
It is **not affiliated with or endorsed by 3FM or NPO** in any way.  
The script respects the 3FM website’s resources and avoids aggressive scraping. Please use responsibly.

## License

MIT License
