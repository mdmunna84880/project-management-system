import { useState } from 'react';
import { useGetMembersQuery, useAddMemberMutation, useRemoveMemberMutation } from './membersApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberSchema } from './memberSchemas';
import { FiUserPlus, FiUserMinus, FiShield } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const MembersPanel = ({ projectId, projectOwnerId }) => {
  const { data: response, isLoading } = useGetMembersQuery(projectId);
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();
  const currentUser = useSelector((state) => state.auth.user);
  
  const [addError, setAddError] = useState('');

  const members = response?.data?.members || [];
  
  
  // Enforce owner-only RBAC for UI controls
  const isOwner = currentUser?._id === projectOwnerId;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: '' },
  });

  const onAddMember = async (data) => {
    try {
      setAddError('');
      await addMember({ projectId, email: data.email }).unwrap();
      reset();
    } catch (err) {
      setAddError(err?.data?.message || 'Failed to add member.');
    }
  };

  const onRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember({ projectId, userId }).unwrap();
      } catch (err) {
        console.error('Failed to remove member:', err);
        alert(err?.data?.message || 'Failed to remove member.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">Project Members</h3>

      {isOwner && (
        <form onSubmit={handleSubmit(onAddMember)} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-grow">
              <input 
                {...register('email')}
                type="email" 
                placeholder="Member's email address"
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
            <button 
              type="submit"
              disabled={isAdding}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center whitespace-nowrap disabled:opacity-70"
            >
              {isAdding ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
              ) : (
                <FiUserPlus className="mr-2" />
              )}
              Add
            </button>
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>}
          {addError && <p className="text-xs text-destructive mt-1 font-medium">{addError}</p>}
        </form>
      )}

      <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {members.map((member) => (
          <li key={member._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {member.user.name}
                  {member.role === 'OWNER' && (
                    <span className="text-[10px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                      <FiShield /> Owner
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{member.user.email}</p>
              </div>
            </div>
            
            {isOwner && member.role !== 'OWNER' && (
              <button 
                onClick={() => onRemoveMember(member.user._id)}
                disabled={isRemoving}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 disabled:opacity-50"
                title="Remove Member"
              >
                <FiUserMinus />
              </button>
            )}
          </li>
        ))}
      </ul>
      {members.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No members found.</p>}
    </div>
  );
};

export default MembersPanel;
