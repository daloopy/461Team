# coding: utf-8

from datetime import date, datetime

from typing import List, Dict, Type

from openapi_server.models.base_model_ import Model
from openapi_server.models.package_data import PackageData
from openapi_server.models.package_metadata import PackageMetadata
from openapi_server import util


class Package(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, metadata: PackageMetadata=None, data: PackageData=None):
        """Package - a model defined in OpenAPI

        :param metadata: The metadata of this Package.
        :param data: The data of this Package.
        """
        self.openapi_types = {
            'metadata': PackageMetadata,
            'data': PackageData
        }

        self.attribute_map = {
            'metadata': 'metadata',
            'data': 'data'
        }

        self._metadata = metadata
        self._data = data

    @classmethod
    def from_dict(cls, dikt: dict) -> 'Package':
        """Returns the dict as a model

        :param dikt: A dict.
        :return: The Package of this Package.
        """
        return util.deserialize_model(dikt, cls)

    @property
    def metadata(self):
        """Gets the metadata of this Package.


        :return: The metadata of this Package.
        :rtype: PackageMetadata
        """
        return self._metadata

    @metadata.setter
    def metadata(self, metadata):
        """Sets the metadata of this Package.


        :param metadata: The metadata of this Package.
        :type metadata: PackageMetadata
        """
        if metadata is None:
            raise ValueError("Invalid value for `metadata`, must not be `None`")

        self._metadata = metadata

    @property
    def data(self):
        """Gets the data of this Package.


        :return: The data of this Package.
        :rtype: PackageData
        """
        return self._data

    @data.setter
    def data(self, data):
        """Sets the data of this Package.


        :param data: The data of this Package.
        :type data: PackageData
        """
        if data is None:
            raise ValueError("Invalid value for `data`, must not be `None`")

        self._data = data
