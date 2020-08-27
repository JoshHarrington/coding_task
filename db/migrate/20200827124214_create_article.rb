class CreateArticle < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.bigint :data_id, null: false, unique: true
      t.string :title, null: false
      t.text :description, null: false
      t.string :image_uid, null: false
      t.datetime :last_listed, null: false

      t.timestamps
    end
  end
end
