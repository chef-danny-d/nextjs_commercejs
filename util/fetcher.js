import axios from 'axios'

const date = new Date()

export const fetcher = async (query) => {
	try {
		const results = await axios.get(
			`https://tfh7h5l0.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(
				query
			)}`,
			{
				headers: {
					'Cache-Control': 'max-age=31536000, immutable',
					'If-Modified-Since': `${date.setMinutes(
						date.getMinutes() - 120
					)}`
				}
			}
		)

		return results.data.result
	} catch (error) {
		throw new Error(error)
	}
}
