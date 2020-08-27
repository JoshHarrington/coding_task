import React, {useState, useEffect} from 'react'

function combineDbClientArticles({dbArticles, clientArticles}) {
	const updatedArticles = clientArticles.map(a => {
		const databaseArticle = dbArticles.filter(dbA => (dbA.data_id === a.id))
		let databaseArticleLikeNum = 0
		if (databaseArticle.length !== 0) {
			databaseArticleLikeNum = databaseArticle[0].likes
		}
		return {...a, likes: a.reactions.likes + databaseArticleLikeNum}
	})
	return updatedArticles
}

function fetchArticleData({updateArticlesList, databaseArticles}) {
	fetch('https://s3-eu-west-1.amazonaws.com/olio-staging-images/developer/test-articles-v3.json')
		.then(response => response.json())
		.then(articlesResponse => {
			updateArticlesList(combineDbClientArticles({dbArticles: databaseArticles, clientArticles: articlesResponse}))
		})
}

function addArticleLike({id, csrfToken, articles, updateArticlesList}) {
	const data = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-Token': csrfToken
		},
		body: JSON.stringify({
			"id": id
    }),
		credentials: 'same-origin'
  }

	fetch('/articles/like', data)
		.then(response => response.json())
		.then(databaseArticles => {
			updateArticlesList(combineDbClientArticles({dbArticles: databaseArticles, clientArticles: articles}))
		})
}

const ArticlesIndex = ({databaseArticles, csrfToken}) => {
	const [articlesList, updateArticlesList] = useState([])

	useEffect(() => {
		fetchArticleData({updateArticlesList, databaseArticles})
	}, [])

	return (
		<main>
			<h1>Articles List</h1>
			<ul>
				{articlesList.map(a => (
					<li
						key={a.id}
						onClick={() => addArticleLike({id: a.id, csrfToken, articles: articlesList, updateArticlesList})}
					>{a.title} likes: {a.likes}</li>
				))}
			</ul>
		</main>
	)
}

export default ArticlesIndex
