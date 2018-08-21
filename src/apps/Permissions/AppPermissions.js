import React from 'react'
import {
  // Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import IdentityBadge from '../../components/IdentityBadge'
import { appRoles } from '../../permissions'
import EntityPermissions from './EntityPermissions'

class AppPermissions extends React.PureComponent {
  getRoles() {
    const {
      app,
      daoAddress,
      loading,
      permissions,
      resolveRole,
      resolveEntity,
    } = this.props

    if (loading || !permissions || !app) {
      return null
    }

    return appRoles(app, permissions, (entity, role) => ({
      role: resolveRole(app.proxyAddress, role),
      entity: resolveEntity(entity, daoAddress),
    }))
  }
  render() {
    const {
      loading,
      permissions,
      address,
      daoAddress,
      resolveRole,
      resolveEntity,
      onRevoke,
    } = this.props
    const roles = this.getRoles()

    return (
      <>
        <Section title="Permissions set on this app">
          {roles === null || loading ? (
            <EmptyBlock>Loading app permissions…</EmptyBlock>
          ) : (
            <Table
              header={
                <TableRow>
                  <TableHeader title="Action" />
                  <TableHeader title="Role identifier" />
                  <TableHeader title="Allowed for" align="right" />
                  {/* <TableHeader /> */}
                </TableRow>
              }
            >
              {roles.map(({ role, entity }, i) => (
                <Row
                  key={i}
                  id={role.id}
                  action={role.name}
                  entity={entity}
                  onRevoke={onRevoke}
                />
              ))}
            </Table>
          )}
        </Section>
        <EntityPermissions
          title="Permissions granted to this app"
          loading={loading}
          address={address}
          permissions={permissions}
          daoAddress={daoAddress}
          resolveRole={resolveRole}
          resolveEntity={resolveEntity}
          onRevoke={onRevoke}
        />
      </>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    this.props.onRevoke(this.props.id)
  }
  renderEntity() {
    const { entity } = this.props
    if (entity.type === 'app') {
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    if (entity.type === 'any') {
      return 'Any account'
    }
    return <IdentityBadge entity={entity.address} />
  }
  render() {
    const { action, id } = this.props
    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{action}</Text>
        </TableCell>
        <TableCell>{id}</TableCell>
        <TableCell align="right">{this.renderEntity()}</TableCell>
        {/* <TableCell align="right">
          <Button
            mode="outline"
            emphasis="negative"
            compact
            onClick={this.handleRevoke}
          >
            Revoke
          </Button>
        </TableCell> */}
      </TableRow>
    )
  }
}

export default AppPermissions
