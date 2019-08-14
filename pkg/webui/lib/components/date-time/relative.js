// Copyright © 2019 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import { FormattedRelativeTime } from 'react-intl'

import PropTypes from '../../prop-types'
import DateTime from '.'

const RelativeTime = function(props) {
  const { className, value, updateIntervalInSeconds, children } = props

  return (
    <DateTime className={className} value={value}>
      {dateTime => (
        <FormattedRelativeTime
          value={new Date(dateTime) - new Date() - 100}
          updateIntervalInSeconds={updateIntervalInSeconds}
        >
          {formattedRelativeTime =>
            children ? children(formattedRelativeTime) : formattedRelativeTime
          }
        </FormattedRelativeTime>
      )}
    </DateTime>
  )
}

RelativeTime.propTypes = {
  /** The time to be displayed */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number, // support timestamps
    PropTypes.instanceOf(Date),
  ]).isRequired,
  /** The interval that the component will re-render in seconds */
  updateIntervalInSeconds: PropTypes.number,
}

RelativeTime.defaultProps = {
  updateIntervalInSeconds: 1,
}

export default RelativeTime
