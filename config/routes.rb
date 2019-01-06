Rails.application.routes.draw do
  devise_for :users
  resources :refs
  get 'extension' => 'extension#hello'
  post 'extension' => 'extension#receive'
  root to: 'refs#index'
end
