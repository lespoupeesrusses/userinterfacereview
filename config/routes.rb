Rails.application.routes.draw do
  devise_for :users
  resources :users, except: [:new, :create]
  resources :refs, :tags
  get 'extension' => 'extension#hello'
  post 'extension' => 'extension#receive'
  root to: 'refs#index'
end
