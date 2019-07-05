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

require 'test_helper'

class RefTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
