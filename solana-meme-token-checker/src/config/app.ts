import { Client, Channel, Events, GatewayIntentBits, SlashCommandBuilder, Interaction } from "discord.js";
import { verifyPincode, verifyRole, verifyUserId } from "../utils/permission.util";
import { verifyInteractionStatus } from "../utils/interaction.util";
import { verifyCA } from "../utils/token.util";


let discordClient: Client;
let botChannel: Channel | undefined;


const setup = async (_channel?: string, _token?: string): Promise<boolean> => {
    if (!_channel || !_token)
        return false

    try {
        discordClient = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
        });

        await discordClient.login(_token);

        await discordClient.on(Events.ClientReady, () => {

            botChannel = discordClient.channels.cache.get(_channel);

            if (botChannel) {
                console.log("Discord bot connected")
            } else {
                console.log("Discord bot failed to connect")
                return false;
            }

            if (discordClient.application) {
                const searchToken = new SlashCommandBuilder()
                    .setName("searchToken")
                    .setDescription("Search for a token")
                    .addStringOption((option) => option.setName('pincode').setDescription("Pincode Verification").setRequired(true))
                    .addStringOption((option) => option.setName('ca').setDescription("The Ca of the token you want to check").setRequired(true))
                    .toJSON();
                discordClient.application.commands.create(searchToken);
            } else {
                console.log("Discord client application wasn't found")
                return false;
            }
        })
    } catch (error) {
        console.log(error)
        return false
    }
    return true
}

const app = async (_channel?: string, _token?: string) => {
    let isBotLoading = false
    while (!isBotLoading) {
        isBotLoading = await setup(_channel, _token);
    }

    try {
        discordClient.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (interaction.isChatInputCommand()) {

                if (!interaction.isChatInputCommand() || !interaction.inGuild()) return


                const userId = interaction.user.id;

                if (!userId) return;



                if (interaction.commandName === "searchToken") {
                    const providedPinCode = interaction.options.getString('pincode');
                    const providedCA = interaction.options.getString('ca');

                    if (!providedPinCode || !providedCA) return;

                    const isValidPincode = await verifyPincode(providedPinCode);

                    if (!isValidPincode) {
                        await interaction.reply({
                            content: "Invalid Pincode",
                            ephemeral: true
                        });
                        return;
                    }

                    const isValidUserId = await verifyUserId(userId);

                    if (!isValidUserId) {
                        await interaction.reply({
                            content: "You are not allowed to use this bot",
                            ephemeral: true
                        })
                        return;
                    }

                    const isValidRole = await verifyRole(interaction);

                    if (!isValidRole) {
                        await interaction.reply({
                            content: "You don't have what it takes",
                            ephemeral: true
                        })
                        return;
                    }

                    const isValidInteraction = await verifyInteractionStatus(userId)
                    if (!isValidInteraction) {
                        await interaction.reply({
                            content: "You really need to slow down",
                            ephemeral: true
                        })
                        return
                    }

                    await interaction.deferReply() //Postpone reply for 15 minutes
                    await interaction.editReply({
                        content: "Alright, let me check that **${providedCA}** for you!",
                    })

                    const isValidCA = verifyCA(providedCA);

                    if (!isValidCA) {
                        await interaction.reply({
                            content: "The token you provided is invalid",
                            ephemeral: true

                        })
                    }

                    const rugCheckReportReponse: RugCheckReportReponse = await getFullReport(providedCA)
                }
            }
        });

    } catch (err) {
        console.log(err)
    }
}
export { app, botChannel, discordClient }