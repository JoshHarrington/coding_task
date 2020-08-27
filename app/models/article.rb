class Article < ApplicationRecord
	validates :data_id, presence: true
	validates_uniqueness_of :data_id

  validates :likes, presence: true
end