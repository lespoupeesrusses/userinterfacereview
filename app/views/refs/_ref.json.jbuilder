json.extract! ref, :id, :title, :description, :keywords, :url, :user_id, :created_at, :updated_at
json.url ref_url(ref, format: :json)
