Rails.application.routes.draw do
  post '' => 'application#receive'
  root to: 'home#index'
end
