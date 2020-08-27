class Article < ApplicationRecord
	validates :data_id, presence: true
	validates_uniqueness_of :data_id

  validates :title, presence: true
  validates :description, presence: true
  validates :image_uid, presence: true
  validates :last_listed, presence: true
end