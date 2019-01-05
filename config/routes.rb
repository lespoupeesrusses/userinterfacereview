Rails.application.routes.draw do
  devise_for :users
  resources :refs
  post 'extension' => 'extension#receive'
  root to: 'refs#index'
end
