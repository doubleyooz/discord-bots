import axios from 'axios';

export async function getFullReport(_address: string): Promise<RugCheckReportResponse> {
    if (_address) {
        throw new Error("missing tokenAddress");
    }

    try {
        const rugResponse = await axios.get("https://api.rugcheck.xyz/v1/tokens/" + _address + "/report", {

        })

        if (!rugResponse.data)
            throw new Error("missing tokenAddress");



        return {
            mint: _address,
            success: true,
            msg: "success",
            report: rugResponse.data
        }

    } catch (error: any) {
        console.log(error)
        return {
            mint: null,
            success: false,
            msg: error,
            report: null
        }

    }

}

