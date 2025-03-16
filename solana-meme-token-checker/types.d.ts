interface RugCheckReport {

}

interface BugCheckReportResponse {
    mint?: string | null;
    success: boolean;
    msg: string;
    report: RugCheckReport | null;
}

interface DiscordReport {
    rugCheckReport: RugCheckReport | null;
}