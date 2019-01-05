# == Schema Information
#
# Table name: refs
#
#  id          :bigint(8)        not null, primary key
#  title       :string
#  description :text
#  keywords    :text
#  url         :string
#  user_id     :bigint(8)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Ref < ApplicationRecord
  belongs_to :user
  has_one_attached :image
  has_one_attached :video

  scope :search, -> (search) { 
    where(
      'unaccent(title) ILIKE unaccent(?)
      OR unaccent(description) ILIKE unaccent(?)
      OR unaccent(keywords) ILIKE unaccent(?)',
      "%#{search}%",
      "%#{search}%",
      "%#{search}%"
    )
  }
  scope :ordered, -> { order(created_at: :desc) }
end
