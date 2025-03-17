import { bold, codeBlock, EmbedBuilder, inlineCode } from "@discordjs/builders";
import { hyperlink } from "discord.js";


export async function sendMessageOnDiscord(botChannel: any, report: DiscordReport) {
    if (!botChannel || !report) return false;

    const { rugCheckReport } = report;


    const { mint, fileMeta, topHolders, tokenMeta, graphInsidersDetected, mintAuthority, totalHolders, risks, freezeAuthority, transferFee, markets, creator, token, totalMarketLiquidity } = rugCheckReport || {};

    const borderColor = "#4fff33";
    const tokenMint = mint || "unknown";
    const tokenName = fileMeta.name || "unknown";
    const tokenSymbol = fileMeta.symbol || "unknown";
    const tokenImage = fileMeta.image || "https://orange-facy-duck-73.mypinata.cloud/ipfs/bafkreibzbptkxxnt15a3yko65hkxr7q5oxfolandunmyas52ttmsyc7ay";
    const tokenDescription = fileMeta.description || "unknown";
    const tokenCreator = creator || "unknown";
    const tokenLiquidity = totalMarketLiquidity || 0;
    const tokenPrice = token.price || 0;
    const tokenSupply = token.supply || 0;
    const tokenDecimals = token.decimals || 0;

    const tokenActualSupply = tokenSupply / Math.pow(10, tokenDecimals);
    const tokenMarketCap = tokenPrice * tokenActualSupply;
    const tokenMainMarket = markets[0].marketType || 'unknown';
    const tokenMainPubKey = markets[0].pubkey || '';

    const tokenMarketCount = markets.length || 0;
    const tokenTransferFee = transferFee.pct || 0;

    const tokenMintable = mintAuthority === null ? 'no' : 'yes';
    const tokenFreezable = freezeAuthority === null ? 'no' : 'yes';
    const tokenMutable = tokenMeta.mutable ? 'yes' : 'no';
    const tokenLPLocked = markets[0].lp.lpLockedPct === 100 ? 'yes' : 'no';

    const dangerLevelIcons = {
        danger: '❌',
        warning: '⚠️'
    }

    const tokenRugRisks = risks?.length ? risks.map((risk) => {
        const icon = dangerLevelIcons[risk.level] || '⚪';
        return `${icon} ${risk.description}`;
    }) : ['🟢 No risks found']

    const tokenTopHolders = totalHolders || 0;
    const tokenInsiders = graphInsidersDetected || 0;

    const totalPct = topHolders.length !== 0 ? `${topHolders.slice(1).reduce((sum, holder) => sum + holder.pct, 0).toFixed(2)}%` : '.'

    const tokenLinks =
        ` | ${hyperlink("NOVA", "https://t.me/TradeonNovaBot?start-digitalbenjamis-" + tokenMint)}` +
        ` | ${hyperLink('GMGN', "https://gmgn.ai/sol/token/" + tokenMint)}` +
        ` | ${hyperlink('NEOB', 'https://neo.bullx.io/terminal?chainId=1399811149&address=' + tokenMint)}` +
        ` | ${hyperlink("BIRD", "https://www.birdeye.so/token/" + tokenMint + "?chain=solana")}` +
        ` | ${hyperlink("DEXS", "https://dexscreener.com/solana" + tokenMint)}` +
        ` | ${hyperlink("AXIOM", "https://axiom.trade/meme/" + tokenMainPubKey)}` +
        ` | ${hyperlink("TWIT", "https://x.com/search/" + tokenMint)}`;

    const embed = new EmbedBuilder()
        .setColor(borderColor)
        .setAuthor({ name: `${tokenName} (${tokenSymbol})`)
        .setDescription(`${bold("Description")} : ${tokenDescription}\n \u2000`)
        .setThumbnail(tokenImage)
        .addFields(
            { name: bold("Is Mintable"), value: `${tokenMintable}`, inline: true },
            { name: bold("Is Freezable"), value: `${tokenFreezable}`, inline: true },
            { name: bold("Is Mutable"), value: `${tokenMutable}`, inline: true },
        )
        .addFields(
            { name: bold("Max Holders"), value: inlineCode(tokenTopHolders.toString()), inline: true },
            { name: bold("Top Holders"), value: inlineCode(totalPct), inline: true },
            { name: bold("Insiders"), value: inlineCode(tokenInsiders.toString()), inline: true },
        )
        .addFields(
            { name: bold("Liquidity"), value: `💦 ${inlineCode(`$${tokenLiquidity.toFixed(2)}`)}`, inline: true },
            { name: bold("MarketCap"), value: `💰 ${inlineCode(`$${tokenMarketCap.toFixed(2)}`)}`, inline: true },
            { name: bold("LP Locked"), value: tokenLPLocked.toString(), inline: true },
        )
        .addFields(
            { name: bold("Main Market"), value: inlineCode(tokenMainMarket), inline: true },
            { name: bold("Markter Count"), value: inlineCode(tokenMarketCount.toString()), inline: true },
            { name: bold("Transfer Fee"), value: inlineCode(`${tokenTransferFee.toString()}%`), inline: true },
        )
        .addFields(
            {
                name: "\u200B \nRug Check Analysis",
                value: Array.isArray(tokenRugRisks) ? tokenRugRisks.join("\n") : "No data available",
                inline: false
            }
        )
        .addFields(
            { name: "\u200B \n" + bold("Contract Address"), value: codeBlock(tokenMint), inline: false },
            { name: bold("Creator"), value: codeBlock(tokenCreator), inline: false },
            { name: bold("Explore"), value: tokenLinks, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Token Information Provider', iconURL: tokenImage });

    botChannel.send({ embeds: [embed] }).then(async (message: data) => {
        await message.react("👍");
        await message.react("👎");
        await message.react("🔥")
    }).catch(err => {
        console.log(err);
    });

    return true;

}