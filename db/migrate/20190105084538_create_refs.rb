class CreateRefs < ActiveRecord::Migration[5.2]
  def change
    create_table :refs do |t|
      t.string :title
      t.text :description
      t.text :keywords
      t.string :url
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
