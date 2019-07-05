# == Schema Information
#
# Table name: tags
#
#  id         :bigint           not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ApplicationRecord

  default_scope { order(:title) }

  def to_s
    "#{title}"
  end
end
