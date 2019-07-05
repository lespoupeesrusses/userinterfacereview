class CreateJoinTableRefTag < ActiveRecord::Migration[5.2]
  def change
    create_join_table :refs, :tags do |t|
      t.references :ref, foreign_key: true
      t.references :tag, foreign_key: true
    end
  end
end
