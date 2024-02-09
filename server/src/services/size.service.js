import { Size } from "../models/size.models.js"

export const createSizeLabel = async (label) => {
    if (label) {
        const findLable = await Size.find({ label });
        if (findLable.length > 0) {
            const msg = "this label already exits"
            throw new Error(msg)
        } else {
            const createLabel = new Size();
            createLabel.label = label;
            await createLabel.save();
            return createLabel
        }

    } else {
        throw new Error({ msg: "did not get label" })
    }
}

export const createSizeOption = async (label, option) => {
    if (label && option) {
        const findLable = await Size.find({ label });
        if (findLable.length > 0) {
            const isOptionValid = findLable[0].options?.map((item) => item === option)
            if (isOptionValid[0]) {
                const msg = "this option already exits"
                throw new Error(msg)
            } else {
                findLable[0].options.push(option);
                await findLable[0].save()
                return findLable
            }
        } else {
            const msg = "label not exits"
            throw new Error(msg)
        }
    } else {
        throw new Error({ msg: "did not get label and option" })
    }
}

export const deleteSizeOption = async (label, option) => {
    if (option && label) {
        const findLable = await Size.findOne({ label: label });
        if (!(findLable === null)) {
            const isOptionValid = findLable.options?.map((item) => item === option)
            console.log(isOptionValid, "isOptionValid");
            if (isOptionValid[0]) {
                let removeOpt = await Size.updateOne({ label: label }, { $pull: { options: option } }, { new: true });
                console.log(removeOpt);
                return removeOpt
            } else {
                throw new Error("this option does not exits")
            }
        } else {
            throw new Error("label not exits or found")
        }
    } else {
        throw new Error("did not get label and option")
    }
}