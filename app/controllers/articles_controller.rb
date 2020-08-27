class ArticlesController < ApplicationController

	def index
		@articles = Article.all
	end

	def add_article_like
		if !params.has_key?(:id)
			respond_to do |format|
				format.json { render json: {status: 'bad request', reason: 'article like not submitted'}.as_json, status: 400}
				format.html { redirect_to root }
			end and return
		end

		article = Article.find_or_create_by(data_id: params[:id])
		update_number_article_likes = article.likes != nil ? article.likes + 1 : 1

		article.update_attributes(
			likes: update_number_article_likes
		)

		respond_to do |format|
			format.json { render json: Article.all.as_json, status: 200}
			format.html { redirect_to root }
		end and return
	end

end