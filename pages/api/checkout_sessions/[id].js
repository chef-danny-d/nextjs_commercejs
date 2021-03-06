import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET)

export default async function handler(req, res) {
	const id = req.params?.session_id

	try {
		if (!id.startsWith('cs_')) {
			throw new Error('Invalid session id')
		}
		const checkout_session = await stripe.checkout.session.retrieve(id)

		res.status(200).json(checkout_session)
	} catch (error) {
		res.status(500).json({ statusCode: 500, message: error.message })
	}
}
