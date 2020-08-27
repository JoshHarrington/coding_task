import React, {useState, useEffect} from 'react'
import { FaArrowAltCircleUp } from 'react-icons/fa'
import classNames from 'classnames'

function combineDbClientArticles({dbArticles, clientArticles}) {
	const updatedArticles = clientArticles.map(a => {
		const databaseArticle = dbArticles.filter(dbA => (dbA.data_id === a.id))
		let databaseArticleLikeNum = 0
		if (databaseArticle.length !== 0) {
			databaseArticleLikeNum = databaseArticle[0].likes
		}
		return {...a, likes: a.reactions.likes + databaseArticleLikeNum}
	})
	const updatedArticlesSorted = updatedArticles.sort((a,b) => b.likes - a.likes)
	return updatedArticlesSorted
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
	const [hoveredArticle, updateHoveredArticle] = useState(null)

	useEffect(() => {
		fetchArticleData({updateArticlesList, databaseArticles})
	}, [])

	return (
		<main className="p-4 flex justify-center" >
			<div className="max-w-full" style={{width:1000}}>

				<h1 className="text-3xl mb-2">Articles List</h1>
				<ul>
					{articlesList.map(a => (
						<li
							className="mb-2 cursor-pointer flex items-center p-2 border rounded border-solid border-gray-200 hover:border-gray-400"
							key={a.id}
							onClick={() => addArticleLike({id: a.id, csrfToken, articles: articlesList, updateArticlesList})}
							onMouseOver={() => updateHoveredArticle(a.id)}
							onMouseLeave={() => updateHoveredArticle(null)}
						>
							<div className="flex flex-col mr-3 items-center">
								<FaArrowAltCircleUp className={classNames("w-6 h-6", {"text-green-600": hoveredArticle === a.id, "text-green-300": hoveredArticle !== a.id})}/>
								<p className={classNames("text-sm", {"text-gray-900": hoveredArticle === a.id, "text-gray-400": hoveredArticle !== a.id})}>{a.likes}</p>
							</div>
							<div className="flex justify-between items-center">
								<img src={a.images[0].files.small} alt={a.title} className="mr-3" />
								<div>
									<h2 className="text-xl">{a.title}</h2>
									<p>{a.description}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}

export default ArticlesIndex
