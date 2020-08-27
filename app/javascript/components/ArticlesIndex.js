import React, {useState, useEffect} from 'react'

function fetchArticleData({updateArticlesList}) {
	fetch('https://s3-eu-west-1.amazonaws.com/olio-staging-images/developer/test-articles-v3.json')
		.then(response => response.json())
		.then(jsonResponse => {
			console.log(jsonResponse)
			updateArticlesList(jsonResponse)
		})
}

const ArticlesIndex = ({articles}) => {
	const [articlesList, updateArticlesList] = useState(articles)

	useEffect(() => {
		fetchArticleData({updateArticlesList})
	}, [])

	return (
		<main>
			<h1>Articles List</h1>
			<ul>
				{articlesList.map(a => <li key={a.id}>{a.title}</li>)}
			</ul>
		</main>
	)
}

export default ArticlesIndex
