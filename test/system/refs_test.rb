require "application_system_test_case"

class RefsTest < ApplicationSystemTestCase
  setup do
    @ref = refs(:one)
  end

  test "visiting the index" do
    visit refs_url
    assert_selector "h1", text: "Refs"
  end

  test "creating a Ref" do
    visit refs_url
    click_on "New Ref"

    fill_in "Description", with: @ref.description
    fill_in "Keywords", with: @ref.keywords
    fill_in "Title", with: @ref.title
    fill_in "Url", with: @ref.url
    fill_in "User", with: @ref.user_id
    click_on "Create Ref"

    assert_text "Ref was successfully created"
    click_on "Back"
  end

  test "updating a Ref" do
    visit refs_url
    click_on "Edit", match: :first

    fill_in "Description", with: @ref.description
    fill_in "Keywords", with: @ref.keywords
    fill_in "Title", with: @ref.title
    fill_in "Url", with: @ref.url
    fill_in "User", with: @ref.user_id
    click_on "Update Ref"

    assert_text "Ref was successfully updated"
    click_on "Back"
  end

  test "destroying a Ref" do
    visit refs_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Ref was successfully destroyed"
  end
end
