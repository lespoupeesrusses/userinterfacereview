require 'test_helper'

class RefsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ref = refs(:one)
  end

  test "should get index" do
    get refs_url
    assert_response :success
  end

  test "should get new" do
    get new_ref_url
    assert_response :success
  end

  test "should create ref" do
    assert_difference('Ref.count') do
      post refs_url, params: { ref: { description: @ref.description, keywords: @ref.keywords, title: @ref.title, url: @ref.url, user_id: @ref.user_id } }
    end

    assert_redirected_to ref_url(Ref.last)
  end

  test "should show ref" do
    get ref_url(@ref)
    assert_response :success
  end

  test "should get edit" do
    get edit_ref_url(@ref)
    assert_response :success
  end

  test "should update ref" do
    patch ref_url(@ref), params: { ref: { description: @ref.description, keywords: @ref.keywords, title: @ref.title, url: @ref.url, user_id: @ref.user_id } }
    assert_redirected_to ref_url(@ref)
  end

  test "should destroy ref" do
    assert_difference('Ref.count', -1) do
      delete ref_url(@ref)
    end

    assert_redirected_to refs_url
  end
end
