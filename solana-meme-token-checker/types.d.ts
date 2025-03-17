interface RugCheckReport extends Record<string, any> { }

interface RugCheckReportResponse {
    mint?: string | null;
    success: boolean;
    msg: string;
    report: RugCheckReport | null;
}

interface DiscordReport {
    rugCheckReport: RugCheckReport | null;
}