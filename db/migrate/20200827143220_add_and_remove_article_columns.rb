class AddAndRemoveArticleColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :articles, :title
    remove_column :articles, :description
    remove_column :articles, :image_uid
    remove_column :articles, :last_listed

    add_column :articles, :likes, :integer, default: 0
  end
end
