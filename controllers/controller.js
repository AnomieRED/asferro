const { Client } = require('@elastic/elasticsearch');
const client = new Client({
	node: 'http://localhost:9200',
	log: 'trace',
});
const axios = require('axios').default;

class Controllers {
	async addArticles(req, res) {
		try {
			const { name } = req.body;
			if (!name) {
				return res.status(400).send({ error: 'Check name article' });
			}
			const getFilm = await axios.get(
				`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${name}&api-key=${process.env.NY_TIMES}`
			);

			const body = getFilm.data.results.flatMap((doc, index) => [
				{ index: { _index: 'film', _id: index + 1 } },
				doc,
			]);

			const { response } = await client.bulk({ body: body, refresh: true });
			res.status(201).json(getFilm.data);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	async getArticles(req, res) {
		try {
			const { size = 5, searchText } = req.query;
			const { body: search } = await client.search({
				index: 'film',
				size: size,
				body: {
					query: {
						match: {
							display_title: searchText.trim(),
						},
					},
				},
			});
			res.status(200).json(search.hits.hits);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	async updateArticle(req, res) {
		try {
			const { byline } = req.body;
			const id = req.params.id;
			if (!byline) {
				return res.status(400).send({ error: 'Check name autor' });
			}
			if (!id) {
				return res.status(404).json('id not specified');
			}
			const update = await client.update({
				index: 'film',
				id: id,
				refresh: true,
				body: {
					doc: {
						byline: byline,
					},
				},
			});
			res.status(200).json(update);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	async deleteArticle(req, res) {
		try {
			const del = req.params.id;
			if (!del) {
				return res.status(400).send({ error: 'id not specified' });
			}
			const remove = await client.delete({
				index: 'film',
				refresh: true,
				id: del,
			});
			res.status(200).json(remove);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}
}

module.exports = new Controllers();
