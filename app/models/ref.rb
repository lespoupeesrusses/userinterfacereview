# == Schema Information
#
# Table name: refs
#
#  id          :bigint           not null, primary key
#  title       :string
#  description :text
#  keywords    :text
#  url         :string
#  user_id     :bigint
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Ref < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :tags
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

  def to_s
    "#{title}"
  end
end
