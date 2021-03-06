class NestedPlaceLocationSerializer < ApplicationSerializer
  attributes :id, :installation, :photo, :name, :short_name, :commission
  belongs_to :address, foreign_key: true
end
