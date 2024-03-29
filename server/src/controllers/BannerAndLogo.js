import { AddBanner, addLogo, deleteBanner, getAllBanner, getLogo } from "../services/BannerAndLogo.service.js";


export const AddBannerController = async (req, res) => {
    try {
        const banner = await AddBanner(req);
        return res.status(200).send(banner);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const getAllBannerController = async (req, res) => {
    try {
        const banner = await getAllBanner(req);
        return res.status(200).send(banner);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const deleteBannerController = async (req, res) => {
    try {
        const banner = await deleteBanner(req);
        return res.status(200).send(banner);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const addLogoController = async (req, res) => {
    try {
        const logo = await addLogo(req);
        return res.status(200).send(logo);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const getLogoController = async (req, res) => {
    try {
        const logo = await getLogo(req);
        return res.status(200).send(logo);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}