import { AddBanner } from "../services/BannerAndLogo.service.js";


export const AddBannerController = async (req, res) => {
    try {
        const banner = await AddBanner(req);
        return res.status(200).send(banner);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}