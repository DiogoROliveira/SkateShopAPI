import Joi from "joi";

export const orderSchema = Joi.object({
    company: Joi.string().required(),
    buyerCustomerParty: Joi.string().required(),
    deliveryTerm: Joi.string().required(),
    documentLines: Joi.array()
        .items(
            Joi.object({
                salesItem: Joi.string().required(),
            })
        )
        .min(1)
        .required(),
});

export const validateOrderRequest = (orderDetails) => {
    const { error } = orderSchema.validate(orderDetails);
    if (error) {
        throw new Error(`Validation Error: ${error.details[0].message}`);
    }
};
