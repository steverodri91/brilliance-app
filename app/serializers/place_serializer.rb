class PlaceSerializer < ApplicationSerializer
  attributes :id, :installation, :photo, :name, :short_name, :commission, :address
  belongs_to :address, foreign_key: true
end
