import React, {useState, useEffect} from 'react'
import { FaHeart, FaHeartBroken } from 'react-icons/fa'
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

function addArticleLike({id, csrfToken, articles, updateArticlesList, updateLatestClickedId}) {
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
			updateLatestClickedId(id)
		})
}

const ArticlesIndex = ({databaseArticles, csrfToken}) => {
	const [articlesList, updateArticlesList] = useState([])
	const [hoveredArticleId, updateHoveredArticleId] = useState(null)
	const [latestClickedId, updateLatestClickedId] = useState(null)

	useEffect(() => {
		fetchArticleData({updateArticlesList, databaseArticles})
	}, [])

	return (
		<main className="p-4 flex justify-center" >
			<div className="max-w-full" style={{width:1000}}>

				<h1 className="text-3xl mb-2">Articles List</h1>
				{articlesList.length === 0 && <p>Loading articles...</p>}
				{articlesList.length > 0 &&
					<ul>
						{articlesList.map(a => (
							<li
								className={classNames(
									"mb-2 cursor-pointer flex items-center p-2 border rounded border-solid border-gray-200 hover:border-gray-400 transition duration-200",
									{
										"border-gray-400 bg-gray-100": latestClickedId === a.id
									})}
								key={a.id}
								onClick={() => {
									addArticleLike({id: a.id, csrfToken, articles: articlesList, updateArticlesList, updateLatestClickedId})
								}}
								onMouseOver={() => updateHoveredArticleId(a.id)}
								onMouseLeave={() => updateHoveredArticleId(null)}
							>
								<div className="flex flex-col mr-3 items-center">
									{!!(a.likes && a.likes > 0) ?
										<FaHeart className={classNames(
											"w-6 h-6 transition duration-200",
											{
												"text-red-600": hoveredArticleId === a.id,
												"text-red-300": hoveredArticleId !== a.id && latestClickedId !== a.id,
												"text-red-400": latestClickedId === a.id,
											})}/>
									:
										<FaHeartBroken className={classNames(
											"w-6 h-6 transition duration-200",
											{
												"text-red-600": hoveredArticleId === a.id,
												"text-red-300": hoveredArticleId !== a.id && latestClickedId !== a.id,
												"text-red-400": latestClickedId === a.id,
											})}/>
									}
									<p className={classNames(
										"text-sm transition duration-200",
										{
											"text-gray-900": hoveredArticleId === a.id || latestClickedId === a.id,
											"text-gray-400": hoveredArticleId !== a.id && latestClickedId !== a.id
										})}>{a.likes}</p>
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
				}
			</div>
		</main>
	)
}

export default ArticlesIndex
